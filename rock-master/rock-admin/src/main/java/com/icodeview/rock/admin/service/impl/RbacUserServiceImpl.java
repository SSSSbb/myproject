package com.icodeview.rock.admin.service.impl;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.extension.conditions.query.LambdaQueryChainWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.icodeview.rock.admin.dto.RbacUserDto;
import com.icodeview.rock.admin.dto.StatusDto;
import com.icodeview.rock.admin.mapper.RbacUserMapper;
import com.icodeview.rock.admin.pojo.*;
import com.icodeview.rock.admin.service.*;
import com.icodeview.rock.admin.vo.MenuDataItem;
import com.icodeview.rock.admin.vo.RbacUserVo;
import com.icodeview.rock.exception.BadHttpRequestException;
import com.icodeview.rock.security.RockUserDetailsService;
import com.icodeview.rock.vo.PageResult;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.security.Permission;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 *
 */
@Service
public class RbacUserServiceImpl extends ServiceImpl<RbacUserMapper, RbacUser>
        implements RbacUserService, RockUserDetailsService {
    @Resource
    private RbacUserRoleService rbacUserRoleService;
    @Resource
    private RbacUserEnterpriseService rbacUserEnterpriseService;

    @Resource
    private RbacRoleService rbacRoleService;
    @Resource
    private RbacRolePermissionService rbacRolePermissionService;
    @Resource
    private RbacPermissionService rbacPermissionService;
    @Resource
    private PasswordEncoder passwordEncoder;
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return getUserDetails(lambdaQuery().eq(RbacUser::getUsername, username));
    }

    @Override
    public List<MenuDataItem> getMenuByUserId(Integer userId) {
        List<Integer> roleIds = rbacUserRoleService.getRoleIdByUserId(userId);
        List<Integer> permissionIds = rbacRolePermissionService.getPermissionIdsByRoleIds(roleIds);
        return rbacPermissionService.getMenuByIds(permissionIds);
    }

    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public RbacUser createUser(RbacUserDto userDto) {
        System.out.println("111"+userDto);
        if(!checkMobile(null,userDto.getMobile())){
            throw new BadHttpRequestException("该手机号已被使用！");
        }
        if(!checkUserName(null,userDto.getUsername())){
            throw new BadHttpRequestException("该用户名已被使用！");
        }
        String password = userDto.getPassword();
        if(StrUtil.isBlank(password)){
            throw new BadHttpRequestException("请设置登录密码！");
        }
        RbacUser user = BeanUtil.copyProperties(userDto, RbacUser.class);
        user.setPassword(passwordEncoder.encode(password));
        System.out.println(userDto);
        user.setBelongto(userDto.getBelongto());
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        System.out.println(user);
        System.out.println(userDto);
        save(user);
        System.out.println(user);
        rbacUserRoleService.attachRole(user.getId(),userDto.getRoleId());
        rbacUserEnterpriseService.attachRelation(user.getId(),userDto.getBelongto());
        return user;
    }

    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public void updateUser(RbacUserDto userDto) {
        System.out.println(userDto.getUsername());
//        if(!checkMobile(userDto.getId(),userDto.getMobile())){
//            throw new BadHttpRequestException("该手机号已被使用！");
//        }
        RbacUser user = BeanUtil.copyProperties(userDto, RbacUser.class);
        String password = userDto.getPassword();
        if(StrUtil.isNotBlank(password)){
            user.setPassword(passwordEncoder.encode(password));
        }
        user.setMobile(userDto.getMobile());
        user.setUsername(userDto.getUsername());
        user.setUpdatedAt(LocalDateTime.now());
        System.out.println(userDto);
        updateById(user);
        rbacUserRoleService.attachRole(user.getId(),userDto.getRoleId());
    }

    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public void deleteUser(Integer id) {
        RbacUser rbacUser = getById(id);
        rbacUserRoleService.detachRole(id);
        removeById(rbacUser.getId());
    }

    @Override
    public void setUserStatus(StatusDto dto) {
        lambdaUpdate().eq(RbacUser::getId,dto.getId())
                .set(RbacUser::getStatus,dto.getStatus())
                .set(RbacUser::getUpdatedAt,LocalDateTime.now())
                .update();
    }

    @Override
    public PageResult<RbacUserVo> getIndex(Integer id,String username, String mobile,Integer belongto, Integer status, Long pageNum, Long pageSize) {
        Page<RbacUser> rbacUserPage = new Page<>(pageNum, pageSize);
        Page<RbacUser> page = lambdaQuery()
                .eq(id != null , RbacUser::getId, id)
                .and(StrUtil.isNotBlank(username), q -> q.like(RbacUser::getUsername, "%" + username + "%"))
                .and(StrUtil.isNotBlank(mobile), q -> q.like(RbacUser::getMobile, "%" + mobile + "%"))
                .eq(status != null && status != 0, RbacUser::getStatus, status)
                .eq(belongto != null , RbacUser::getBelongto, belongto)
                .orderByDesc(RbacUser::getId)
                .page(rbacUserPage);
        List<RbacUserVo> record = page.getRecords().stream().map(rbacUser -> {
            RbacUserVo user = BeanUtil.copyProperties(rbacUser, RbacUserVo.class);
            RbacUserRole userRole = rbacUserRoleService.lambdaQuery()
                    .eq(RbacUserRole::getUserId, user.getId())
                    .last("limit 1")
                    .one();
            RbacRole rbacRole = rbacRoleService.getById(userRole.getRoleId());
            user.setRole(rbacRole);
            user.setRoleId(rbacRole.getId());
            return user;
        }).collect(Collectors.toList());
        return PageResult.page(record,page);
    }

    @Override
    public String getHomeUrl(Integer userId) {
        List<Integer> roleIds = rbacUserRoleService.getRoleIdByUserId(userId);
        List<String> permission = rbacRolePermissionService.getPermissionByRoleIds(roleIds);
        System.out.println(roleIds.get(0));
        Optional<String> homeUrlOptional = permission.stream().filter(url -> url.contains("index")).findFirst();
        if(roleIds.get(0)==1){
            return "/rbac/user/index";
        }else return "/main/charts/index";
    }


    private boolean checkMobile(Integer userId,String mobile){
        return checkParams(userId, lambdaQuery().eq(RbacUser::getMobile, mobile), mobile);
    }

    private boolean checkUserName(Integer userId,String username){
        return checkParams(userId, lambdaQuery().eq(RbacUser::getUsername, username), username);
    }

    private boolean checkParams(Integer userId, LambdaQueryChainWrapper<RbacUser> eq, String mobile) {
        RbacUser rbacUser = eq
                .select(RbacUser::getId)
                .one();
        if(userId==null){
            if(rbacUser!=null){
                return false;
            }
        }else{
            if(rbacUser.getId().equals(userId)){
                return true;
            }
        }
        return true;
    }

    @Override
    public UserDetails getUserDetailsById(Long id) {
        return getUserDetails(lambdaQuery().eq(RbacUser::getId, id));
    }

    private UserDetails getUserDetails(LambdaQueryChainWrapper<RbacUser> eq) {
        RbacUser user = eq.one();
        if(user==null){
            throw new UsernameNotFoundException("用户不存在！");
        }
        List<Integer> roleIds = rbacUserRoleService.getRoleIdByUserId(user.getId());
        List<String> authorities = rbacRolePermissionService.getPermissionByRoleIds(roleIds);
        List<String> roles = rbacRoleService.getRoleByIds(roleIds);
        roles = roles.stream().map(rc -> "ROLE_" + rc).collect(Collectors.toList());

        authorities.addAll(roles);
        List<GrantedAuthority> authorityList = AuthorityUtils.commaSeparatedStringToAuthorityList(String.join(",", authorities));

        user.setAuthorities(authorityList);

        Map<String, Boolean> access = rbacRoleService.getRoleAccess(roleIds);
        user.setAccess(access);
        return user;
    }
}




